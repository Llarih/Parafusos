document.addEventListener('DOMContentLoaded', function() {
    const tabs = document.querySelectorAll('.tab-link');
    const contents = document.querySelectorAll('.tab-content');
    const scrollToImageBtn = document.getElementById('scrollToImageBtn');
    const sensorImage = document.getElementById('sensorImage');

    tabs.forEach(tab => {
        tab.addEventListener('click', function(event) {
            event.preventDefault();
            const target = this.getAttribute('data-tab');

            contents.forEach(content => {
                content.classList.remove('active');
            });

            tabs.forEach(t => {
                t.classList.remove('active');
            });

            document.getElementById(target).classList.add('active');
            this.classList.add('active');
        });
    });

    if (tabs.length > 0) {
        tabs.forEach(t => t.classList.remove('active'));
        contents.forEach(c => c.classList.remove('active'));

        tabs[0].classList.add('active');
        contents[0].classList.add('active');
    }

    const conveyorBelt = document.getElementById('conveyorBelt');
    const screwCountDisplay = document.getElementById('screwCount');
    const statusMessage = document.getElementById('statusMessage');
    const startBtn = document.getElementById('startBtn');
    const pieceCountDisplay = document.getElementById('pieceCount');

    let screwWeight = 100;
    const screwPerPiece = 4;
    const screwWeightPerUnit = 10;
    let pieceCount = 0;

    startBtn.addEventListener('click', startSimulation);

    function startSimulation() {
        createPiece();
    }

    function createPiece() {
        const piece = document.createElement('div');
        piece.classList.add('piece');

        const screwPositions = ['screw-top-left', 'screw-top-right', 'screw-bottom-left', 'screw-bottom-right'];
        screwPositions.forEach(pos => {
            const screw = document.createElement('div');
            screw.classList.add('screw', pos);
            piece.appendChild(screw);
        });

        conveyorBelt.appendChild(piece);

        setTimeout(() => {
            piece.style.left = '50%';

            setTimeout(() => {
                mountScrews(piece);
            }, 2500);
        }, 100);
    }

    function mountScrews(piece) {
        const screws = piece.querySelectorAll('.screw');
        screws.forEach(screw => {
            screw.style.display = 'block';
        });

        const gramasUtilizadas = screwPerPiece * screwWeightPerUnit;
        screwWeight -= gramasUtilizadas;
        updateScrewBox(gramasUtilizadas);

        setTimeout(() => {
            piece.style.left = '100%';

            setTimeout(() => {
                piece.remove();
                pieceCount++;
                updatePieceCount();
                createPiece();
            }, 2500);
        }, 1000);
    }

    function updateScrewBox(gramasUtilizadas) {
        screwCountDisplay.textContent = screwWeight;

        if (screwWeight <= 20) {
            statusMessage.textContent = '⚠️ Estoque baixo! Solicitando reposição...';

            setTimeout(() => {
                screwWeight = 100;
                screwCountDisplay.textContent = screwWeight;
                statusMessage.textContent = '✅ Estoque Reposto!';
                saveSimulationData('Sensor de Carga 1', 'Estoque Reposto', gramasUtilizadas, screwWeight); // Salvar dados após reposição
            }, 2000);
        } else {
            statusMessage.textContent = '✅ Estoque Normal';
            saveSimulationData('Sensor de Carga 1', 'Estoque Normal', gramasUtilizadas, screwWeight); // Salvar dados após atualização normal
        }
    }

    function updatePieceCount() {
        pieceCountDisplay.textContent = pieceCount;
    }

    function saveSimulationData(sensor, status_estoque, gramas_utilizadas, gramas_restantes) {
        fetch('http://localhost:3001/api/interacao', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                sensor,
                status_estoque,
                gramas_utilizadas,
                gramas_restantes
            })
        })
        .then(response => response.text())
        .then(data => {
            console.log('Dados da simulação salvos:', data);
        })
        .catch(error => {
            console.error('Erro ao salvar os dados da simulação:', error);
        });
    }

    // Verificar se a imagem do sensor está carregada
    if (sensorImage) {
        sensorImage.addEventListener('load', function() {
            console.log('Imagem do sensor carregada com sucesso.');
        });

        sensorImage.addEventListener('error', function() {
            console.error('Erro ao carregar a imagem do sensor.');
        });
    } else {
        console.error('Elemento da imagem do sensor não encontrado.');
    }

    // Rolar até a imagem do sensor quando o botão for clicado
    if (scrollToImageBtn) {
        scrollToImageBtn.addEventListener('click', function() {
            sensorImage.scrollIntoView({ behavior: 'smooth' });
        });
    }
});
