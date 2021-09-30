import { useOktaAuth } from "@okta/okta-react";
import { useState, useEffect } from "react";

const Home = () => {
  const { authState, oktaAuth } = useOktaAuth();
  const [userInfo, setUserInfo] = useState(null);
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    if (!authState || !authState.isAuthenticated) {
      setUserInfo(null);
    } else {
      oktaAuth.getUser().then((info) => {
        setUserInfo(info);
      });
    }
  }, [authState, oktaAuth]);

  const callBackend = async () => {
    console.log(authState.accessToken.accessToken, "*********");
    const response = await fetch("http://localhost:8080/api/locked", {
      headers: {
        Authorization: `Bearer ${authState.accessToken.accessToken}`,
      },
    });

    if (!response.ok) {
      console.log("rejecting", response);
      return Promise.reject();
    }
    const data = await response.json();
    setMessages(data.messages);
  };

  if (!userInfo) {
    return (
      <div>
        <p>Fetching user profile...</p>
      </div>
    );
  }

  return (
    <div>
      {userInfo && (
        <div>
          <p>Welcome back, {userInfo.name}!</p>
        </div>
      )}
      <table>
        <thead>
          <tr>
            <th>Claim</th>
            <th>Value</th>
          </tr>
        </thead>
        <tbody>
          {Object.entries(userInfo).map((claimEntry) => {
            const claimName = claimEntry[0];
            const claimValue = claimEntry[1];
            const claimId = `claim-${claimName}`;
            return (
              <tr key={claimName}>
                <td>{claimName}</td>
                <td id={claimId}>{claimValue.toString()}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <button onClick={callBackend}>Call api</button>
      <table>
        <thead>
          <tr>
            <th>Date</th>
            <th>Message</th>
          </tr>
        </thead>
        <tbody>
          {messages?.map((message, index) => (
            <tr key={index} id={message.id}>
              <td>{message.date}</td>
              <td>{message.text}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Home;
