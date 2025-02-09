import { dbConnect } from '../../../../lib/dbConnect';
import Users from '../../../../models/user.model';
import { OAuth2Client } from 'google-auth-library';
import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import jwt from 'jsonwebtoken';
import { UserToken } from '../../../../models/usertoken';

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const generateTokens = async (user) => {
  try {
    const payload = { _id: user._id };

    const accessToken = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '5d' });
    const refreshToken = jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '30d' });

    const userToken = await UserToken.findOne({ userId: user._id });
    if (userToken) {
      await userToken.deleteOne();
    }
    await new UserToken({ userId: user._id, token: refreshToken }).save();

    return { accessToken, refreshToken };
  } catch (err) {
    throw err;
  }
};

const getTokenFromBackend = async (user, account) => {
  await dbConnect();
  const token = account.id_token;
  if (!token) throw new Error('ID token is missing');

  const email = user.email;
  await client.verifyIdToken({ idToken: token, audience: process.env.GOOGLE_CLIENT_ID });
  const user1 = await Users.findOne({ email });
  const { accessToken } = await generateTokens(user1);
  return accessToken;
};

const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider === 'google') {
        try {
          await dbConnect();
          const userExists = await Users.findOne({ email: user.email });
          if (!userExists) await new Users({ name: user.name, email: user.email }).save();

          return true;
        } catch (error) {
          console.error(error);
          return false;
        }
      }
      return false;
    },
    async jwt({ token, user, account }) {
      if (account && user) {
        return {
          idToken: account.id_token,
          accessToken: account.access_token,
          accessTokenExpires: account.expires_at ? account.expires_at * 1000 : 0,
          refreshToken: account.refresh_token || '',
          accessTokenFromBackend: await getTokenFromBackend(user, account),
          user,
        };
      }

      if (Date.now() < token.accessTokenExpires) return token;
      return refreshAccessToken(token);
    },
    async session({ session, token }) {
      session.user = token.user || { name: null, email: null, image: null };
      session.accessToken = token.accessToken;
      session.accessTokenBackend = token.accessTokenFromBackend;
      session.idToken = token.idToken;
      session.error = token.error || null;
      return session;
    },
  },
};

async function refreshAccessToken(token) {
  try {
    const refreshToken = token.refreshToken;
    if (typeof refreshToken !== 'string') throw new Error('Invalid refresh token');

    const url =
      'https://oauth2.googleapis.com/token?' +
      new URLSearchParams({
        client_id: process.env.GOOGLE_CLIENT_ID,
        client_secret: process.env.GOOGLE_CLIENT_SECRET,
        grant_type: 'refresh_token',
        refresh_token: refreshToken,
      });

    const response = await fetch(url, {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      method: 'POST',
    });
    const refreshedTokens = await response.json();
    if (!response.ok) throw refreshedTokens;

    return {
      ...token,
      idToken: refreshedTokens.id_token,
      accessToken: refreshedTokens.access_token,
      accessTokenExpires: Date.now() + refreshedTokens.expires_in * 1000,
      refreshToken: refreshedTokens.refresh_token || token.refreshToken,
    };
  } catch (error) {
    console.log(error);
    return { ...token, error: 'RefreshAccessTokenError' };
  }
}

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
