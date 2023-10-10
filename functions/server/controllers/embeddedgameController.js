const { db, storage } = require("../models/db");

exports.getGame = async (req, res, next) => {
	let paramID = req.params.game_id;
	const options = {
		version: 'v4',
		action: 'read',
		expires: Date.now() + 15 * 60 * 1000, // 15 minutes
	};

	try {
		const data_gz = await storage
			.bucket('technoviumunlimited.appspot.com')
			.file('games/' + paramID + "/game.data")
			.getSignedUrl(options);

		const framework_js_gz = await storage
			.bucket('technoviumunlimited.appspot.com')
			.file('games/' + paramID + "/game.framework.js")
			.getSignedUrl(options);


		const loader_js = await storage
			.bucket('technoviumunlimited.appspot.com')
			.file('games/' + paramID + "/game.loader.js")
			.getSignedUrl(options);

		const wasm_gz = await storage
			.bucket('technoviumunlimited.appspot.com')
			.file('games/' + paramID + "/game.wasm")
			.getSignedUrl(options);

		const game = [];
		const query = await db.collection("games").doc(paramID).get();
		//game.push({ ...query.data(), _id: query.id, _data_gz: data_gz, _framework_js_gz: framework_js_gz, _loader_js: loader_js, _wasm_gz: wasm_gz });


		// Get a v4 signed URL for reading the file

		//file_path = await storage
		//	 .file('technoviumunlimited.appspot.com' +'/games/' + paramID + "/game.data.gz")
		//	 .getDownloadURL();
		//console.log(file_path);
		/*let url = await 
						firebase.storage()
						.ref('Audio/English/United_States-OED-' + i +'/' + $scope.word.word + ".mp3")
						.getDownloadURL();
*/
        const htmlContent = `
        <!DOCTYPE html>
        <html lang="en-us">
          <head>
            <meta charset="utf-8">
            <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
            <title>Unity WebGL Player | 3d-spin-wheel</title>
            <link rel="shortcut icon" href="TemplateData/favicon.ico">
            <link rel="stylesheet" href="https://technoviumunlimited.nl/css/unitystyle.css">
          </head>
          <body>
            <div id="unity-container" class="unity-desktop" style="position: absolute; width: 100%; height: 100%; overflow:hidden;">
              <canvas id="unity-canvas" width="100%" height="100%" style="width: 100%; height: 100%"></canvas>
              <div id="unity-loading-bar">
                <div id="unity-logo"></div>
                <div id="unity-progress-bar-empty">
                  <div id="unity-progress-bar-full"></div>
                </div>
              </div>
              <div id="unity-warning"></div>
              <!--
              <div id="unity-footer">
                <div id="unity-fullscreen-button"></div>
              </div>
              -->
            </div>
            <script>
              matchWebGLToCanvasSize=false;
              var container = document.querySelector("#unity-container");
              var canvas = document.querySelector("#unity-canvas");
              var loadingBar = document.querySelector("#unity-loading-bar");
              var progressBarFull = document.querySelector("#unity-progress-bar-full");
              //var fullscreenButton = document.querySelector("#unity-fullscreen-button");
              var warningBanner = document.querySelector("#unity-warning");
              function unityShowBanner(msg, type) {
                function updateBannerVisibility() {
                  warningBanner.style.display = warningBanner.children.length ? 'block' : 'none';
                }
                var div = document.createElement('div');
                div.innerHTML = msg;
                warningBanner.appendChild(div);
                if (type == 'error') div.style = 'background: red; padding: 10px;';
                else {
                  if (type == 'warning') div.style = 'background: yellow; padding: 10px;';
                  setTimeout(function() {
                    warningBanner.removeChild(div);
                    updateBannerVisibility();
                  }, 5000);
                }
                updateBannerVisibility();
              }
        
              var loaderUrl = "`+ loader_js +`";
              var config = {
                dataUrl: "`+ data_gz +`",
                frameworkUrl: "`+ framework_js_gz +`",
                codeUrl: "`+ wasm_gz +`",
                streamingAssetsUrl: "StreamingAssets",
                companyName: "DefaultCompany",
                productName: "3d-spin-wheel",
                productVersion: "0.1",
                showBanner: unityShowBanner,
              };
        
              if (/iPhone|iPad|iPod|Android/i.test(navigator.userAgent)) {
                // Mobile device style: fill the whole browser client area with the game canvas:
        
                var meta = document.createElement('meta');
                meta.name = 'viewport';
                meta.content = 'width=device-width, height=device-height, initial-scale=1.0, user-scalable=no, shrink-to-fit=yes';
                document.getElementsByTagName('head')[0].appendChild(meta);
                container.className = "unity-mobile";
                canvas.className = "unity-mobile";
        
                // To lower canvas resolution on mobile devices to gain some
                // performance, uncomment the following line:
                // config.devicePixelRatio = 1;
        
                unityShowBanner('WebGL builds are not supported on mobile devices.');
              } else {
                // Desktop style: Render the game canvas in a window that can be maximized to fullscreen:
        
                canvas.style.width = "100%";
                canvas.style.height = "100%";
              }
        
              loadingBar.style.display = "block";
        
              var script = document.createElement("script");
              script.src = loaderUrl;
              script.onload = () => {
                createUnityInstance(canvas, config, (progress) => {
                  progressBarFull.style.width = 100 * progress + "%";
                }).then((unityInstance) => {
                  loadingBar.style.display = "none";
                  /*
                  fullscreenButton.onclick = () => {
                    unityInstance.SetFullscreen(1);
                  };
                  */
                }).catch((message) => {
                  alert(message);
                });
              };
              document.body.appendChild(script);
            </script>
          </body>
        </html>
        `;
        res.setHeader('Content-Type', 'text/html');
        res.send(htmlContent);
		//res.status(200).json({ game });

	} catch (err) {
		console.error(err);
		res.status(500).send();
	}
};