import { NextPage } from 'next';
import Head from 'next/head';

const Home: NextPage = () => {
  return (
    <div>
      <Head>
        <title>SoftArt VibeCode</title>
        <meta name="description" content="Modern web application" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main style={{ padding: '2rem', textAlign: 'center' }}>
        <h1>Welcome to SoftArt VibeCode</h1>
        <p>Your modern web application is running!</p>
      </main>
    </div>
  );
};

export default Home;





