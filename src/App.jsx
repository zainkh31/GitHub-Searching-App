import { useState } from "react";
import "./App.css";
import axios from "axios";

function App() {
  const [githubUserName, setGithubUserName] = useState("");
  const [userObj, setUserObj] = useState({});
  const [repos, setRepos] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const searchUser = async () => {
    try {
      setError("");
      setUserObj({});
      setRepos([]);
      setLoading(true);

      if (!githubUserName) {
        setError("Please enter a valid username");
        setLoading(false);
        return;
      }

      const getUser = await axios.get(
        `https://api.github.com/users/${githubUserName}`
      );
      setUserObj({ ...getUser.data });

      const getRepos = await axios.get(
        `https://api.github.com/users/${githubUserName}/repos?sort=updated&per_page=10`
      );
      setRepos(getRepos.data);
    } catch {
      setError("User not found. Please check the username.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app-container">
      <div className="search-bar">
        <input
          type="text"
          value={githubUserName}
          onChange={(e) => setGithubUserName(e.target.value)}
          placeholder="Enter GitHub username"
        />
        <button onClick={searchUser}>Search</button>
      </div>

      {loading && <p className="loading">Loading...</p>}
      {error && <p className="error">{error}</p>}

      {userObj.login && (
        <div className="user-card">
          <img src={userObj.avatar_url} alt="avatar" />
          <h2>{userObj.login}</h2>
          <p>Followers: {userObj.followers}</p>
          <p>Following: {userObj.following}</p>
          <p>Public Repos: {userObj.public_repos}</p>
          <p>{userObj.bio ? userObj.bio : "No bio available"}</p>
        </div>
      )}

      {repos.length > 0 && (
        <div className="repo-list">
          {/* <h3>Repositories</h3> */}
          <h2 className="repos-heading">Repositories</h2>
          <div className="repo-grid">
            {repos.map((repo) => (
              <div key={repo.id} className="repo-card">
                <a href={repo.html_url} target="_blank" rel="noreferrer">
                  <h4>{repo.name}</h4>
                </a>
                <p>{repo.description ? repo.description : "No description"}</p>
                <p>Stars: {repo.stargazers_count}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
