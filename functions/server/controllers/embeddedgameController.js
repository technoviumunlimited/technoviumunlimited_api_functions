const { db, storage } = require("../models/db");

exports.getGame = async (req, res, next) => {
	let paramID = req.params.game_id;

  const game = [];
  const query = await db.collection("games").doc(paramID).get();
  game.push({ ...query.data(), _id: query.id });

  console.log(game[0].game_engine);

	const options = {
		version: 'v4',
		action: 'read',
		expires: Date.now() + 15 * 60 * 1000, // 15 minutes
	};
  
    const htmlGodot = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <title>Fullscreen Iframe Example</title>
        <style>
            body, html {
                margin: 0;
                padding: 0;
                height: 100%;
                overflow: hidden;
            }
            iframe {
                width: 100%;
                height: 100%;
                border: none;
            }
        </style>
    </head>
    <body>
    
    <iframe id="fullscreenIframe" src="https://api.technoviumunlimited.nl/games/${paramID}/index.html"></iframe>
    
    <script>
        const iframe = document.getElementById('fullscreenIframe');
    
        function openFullscreen() {
            if (iframe.requestFullscreen) {
                iframe.requestFullscreen();
            } else if (iframe.mozRequestFullScreen) {
                iframe.mozRequestFullScreen();
            } else if (iframe.webkitRequestFullscreen) {
                iframe.webkitRequestFullscreen();
            } else if (iframe.msRequestFullscreen) {
                iframe.msRequestFullscreen();
            }
        }
    
        // Trigger fullscreen when the document is ready
        document.addEventListener('DOMContentLoaded', openFullscreen);
    </script>
    
    </body>
    </html>
    
    `;
    //const htmlGodot = `<iframe src="https://api.technoviumunlimited.nl/games/Ag7KtmdKNIG0va7bi1ne/index.html"></iframe>`
    res.setHeader('Content-Type', 'text/html');
    res.send(htmlGodot);
};