    var drawLobby = function(data) {
        var lobbyCanvas = document.getElementById('lobbyCanvas');
        var lobbyContext = lobbyCanvas.getContext('2d');
        lobbyCanvas.style.background='#2c3e50';
        lobbyCanvas.style.display='block';
        lobbyContext.clearRect(0, 0, lobbyCanvas.width, lobbyCanvas.height);
        var games = data.gameList;
        var players = data.playerList.length;
        var i,j;
        for (i = 0; i < games.length; i++) {
            if (games[i] != "empty") {
                lobbyContext.font = "bold 24px sans-serif";
                var len = games[i].length;
                if (len >= 2) { len = 2; };
                lobbyContext.fillText('Game ' + (i) + ' ' + len + ' / 2 players', 80, i * 30 + 30);
                lobbyContext.fill();
                document.getElementById(i.toString()).style.display='block';
            };
        };
        document.getElementById('createGameButton').style.display='block';
        document.getElementById('refresh').style.display='block';
    };
    var clearLobby = function() {
        var lobbyCanvas = document.getElementById('lobbyCanvas');
        var lobbyContext = lobbyCanvas.getContext('2d');
        lobbyCanvas.style.background='transparent';
        lobbyCanvas.style.display='none';
        lobbyContext.clearRect(0, 0, lobbyCanvas.width, lobbyCanvas.height);
        var i;
        for (i = 0; i < 21; i++) {
            document.getElementById(i.toString()).style.display='none';
        };
        document.getElementById('createGameButton').style.display='none';
        document.getElementById('refresh').style.display='none';
    };