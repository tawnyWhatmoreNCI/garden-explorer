import type { NextPage } from 'next';
import Head from 'next/head';
import styles from '../styles/Home.module.css';
import AnimatedLogo from '../components/AnimatedLogo';
import StatementPoints from '../components/StatementPoints';
import Footer from '../components/Footer';
import UploadObservation from '../components/UploadObservation';
import ShowUserObservations from '../components/ShowUserObservations';

const About: NextPage = () => {
  return (
    <div className="container">
      <Head>
        <title>Garden Explorer</title>
        <meta
          content="Connecting children to nature"
          name="Garden Explorer"
        />
        <link href="/favicon.ico" rel="icon" />
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Quicksand:wght@300..700&display=swap" />
        <link rel="stylesheet" href="/src/fonts/Magica.otf" />
      </Head>

      <main className={styles.main}>
        <h1 className={`${styles.title} ${styles.fadeInTitle}`}>Garden Explorer</h1>
        <h2 className={styles.subtitle}>Unlock the magic of nature</h2>
        <AnimatedLogo/>

        <div className={styles.container}>
          <UploadObservation />
          <ShowUserObservations />
      <StatementPoints/>
        <div className={styles.content}>
          <h3>The Roots</h3>
          <p>
            Garden Explorer is a platform that aims to connect us to the natural world. 
            Built on the power of blockchain tech everyone can create a digital garden that grows with them.
          </p>
          <p>
            Get a little closer to nature. Explore, discover. There is magic in the world and we have evolved to become blind to it. Lets reaquaint ourselves with the spells to unlock it. 
           </p>
           <ol>
              <li><b>Spend time outdoors.</b> Leisurely walks, gardening or simply sitting on an outdoor bench is your first step.</li>
              <li><b>Slow down.</b> Pace yourself when out for a walk. Focus on the sights, sounds and smells around you.</li>
              <li><b>Engage your sense.</b> Listen to the bird song, the rustling wind or running water. Feel the textures of leaves, bark, soil. Observe colours, patterns and movements.</li>
              <li><b>Learn.</b> Open yourself up to understanding the natural world, and you will immediately increase your appreciation. Take time to identify species be it animal or plant.</li>
            </ol>
            <p>Learning is where Garden Explorer can help.</p>
            
            <p>
              By using your observational contributions and the power of blockchain technologies, Garden Explorer can build a community of enthusiastic naturalists that come together to create a public, immutable dataset of our findings from the natural world. 
            </p>
          <h3>Be Wild. Be Spellbound.</h3>
          <p>
            So get ourdoors and explore. Take photos of plants, animals, and fungi. Upload them to your digital Garden Explorer garden.
            Garden Explorer will help you identify what you find.
            Collect and earn badges for your discoveries. Share and compare with friends. 
            As you learn more, rate the quality of observations on the platform and surpass the AI by correcting its idenification errors and help to build a thriving community of wild explorers.
          </p>
          <h3>Why Web3?</h3>
            Garden Explorer is built on the Ethereum blockchain. By using blockchain technology, we can create a platform that is secure, transparent, and decentralised.
            This means the data you submit is safe, and cannot be tampered with. This immutable characteristic of a dataset is vital for scientific research.
            So as you submit your observations, you are contributing to a global dataset that can be used by scientists, ecologist and researchers. 
            As well as this, you are not required to submit any personal information to be able to use Garden Explorer. All you need is a web3 wallet.
          <p>
          </p>
          <h3>Hopes for the Future</h3>
          <p>
            Remember back in 2016 when Pokemon Go was first released? People of all ages were out in the fresh air, running amock chasing after virtual creatures. Having great craic.
            I want to capture this enthusiasm and energy and direct it towards the natural world. 
            Lets run wild after a butterfly, observe a dragonfly inflate its wings, long for the glimpse of a pair of bullfinches.
          </p>
          <p>
            The creatures of this world are not insignificant, they are the foundation of our ecosystem.
            Without them, the world would be a very different place. So lets bother ourselves to learn about them. 
            And learn to love the role they play. 
          </p>
        </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default About;
