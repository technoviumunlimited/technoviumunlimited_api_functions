using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.Networking;
using Newtonsoft.Json.Linq;
using Newtonsoft.Json; //unsure if this is needed

// we need jwt code, level id and game id to save data to server with post request at firebase game_id/level_id/score_users

public class restfullAPI : MonoBehaviour
{
    private const string game_id = "HEAryAXZyQgzqa5AOoey"; //if you use this code, please change this game id to your game id
    private const string level_id = "1"; //if you use this code, please change this level id to your level id
    private const string API_ENDPOINT = "https://api.technoviumunlimited.nl/v1/score/"; //if you use this code, please change this game id to your game id and level id to your level id

    void Start()
    {
        StartCoroutine(PostData());
    }

    IEnumerator PostData()
    {
        string filePath = "%AppData%/Roaming/TechnoviumUnlimited/game/st.daliop";
        string fileContents = File.ReadAllText(filePath);
        JObject json = JsonConvert.DeserializeObject<JObject>(fileContents);
        string jwt = json.GetValue("token").ToString();
        
        using (UnityWebRequest www = UnityWebRequest.Post(API_ENDPOINT))
        {
            www.SetRequestHeader("Authorization", "Bearer " + jwt);
            www.setRequestHeader("Content-Type", "application/json");
            www.addJsonContent(new { game_id = game_id, level_id = level_id});
            yield return www.SendWebRequest();
            
            if (www.isNetworkError || www.isHttpError)
            {
                Debug.LogError(www.error);
            }
            else
            {
                // Successful request
                string data = www.downloadHandler.text;
                Debug.Log(data);
            }
        }
    }
}
