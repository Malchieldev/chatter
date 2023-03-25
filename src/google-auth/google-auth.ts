import axios from "axios";

const getGoogleUserInfo = async (access_token: string) => {
  const url = `https://www.googleapis.com/oauth2/v3/userinfo`;
  const headers = { Authorization: `Bearer ${access_token}` };

  const { data } = await axios.get(url, { headers });
  return {
    name: data.name as string,
    photo: data.picture as string,
    googleId: data.sub as string,
  };
};

export { getGoogleUserInfo };
