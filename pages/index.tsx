import type { NextPage } from 'next';
import Head from 'next/head';
import styles from '../styles/Home.module.css';
import AnimatedLogo from '../components/AnimatedLogo';
import StatementPoints from '../components/StatementPoints';
import Footer from '../components/Footer';

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
        {/*locally hosted font*/}
        <link href="../src/fonts/Magica.otf" rel="stylesheet" />
        {/*google hosted font*/}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link href="https://fonts.googleapis.com/css2?family=Quicksand:wght@300..700&display=swap" rel="stylesheet" />
      </Head>

      <main className={styles.main}>
        <h1 className={`${styles.title} ${styles.fadeInTitle}`}>Garden Explorer</h1>
        <h2 className={styles.subtitle}>Unlock the magic of nature</h2>
        <AnimatedLogo/>

        <div className={styles.container}>
      <StatementPoints/>
        <div className={styles.content}>
          <h3>The Roots</h3>
          <p>
            Garden Explorer is a platform that connects us to the natural world. 
            By using the power of blockchain technology, everyone can create a digital garden that grows with them.
          </p>
          <p>
            Get a little closer to nature. Explore, discover. There is magic in the world and we as a species have become blind to it, work against it, and often destroy it. 
            That little bee thats sitting next to you on your picnic blanket is not a threat, its working hard foraging for nectar and pollen to support their colony or offspring. It&apos;s just taking a break. Don&apos;t harm it.<br/>
            The plants that grow in your garden are not weeds, they are wildflowers. They are food for many creatures and they are beautiful.
            By learning about the world around us, we open our eyes to the magic. Living in ignorance to the wonders waiting to be unlocked is a tragedy.
            Garden Explorer is a way to educate and rewild yourself, your family, your friends. A way to connect us all to our wild roots again.
          </p>
          <h3>Be Wild. Be Spellbound.</h3>
          <p>
            Get out and explore. Take photos of plants, animals, and fungi. Upload to your digital Garden Explorer garden.
            Using AI and machine learning, Garden Explorer will help you identify what you find.
            Collect and earn badges for your discoveries. Share and compare with friends. 
            As you learn more, you can surpass the AI and correct its idenification errors and help to build a thriving community of wild explorers.
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
            I want to capture this enthusiasm and energy and direct it towards the natural world. Lets run wild after a butterfly, observe a dragonfly inflate its wings, long for the glimpse of a pair of bullfinches.
          </p>
          <p>
            We have without a doubt become a destructive species. 
            Challenging the destructive habits of larger corporations that are wrecking the earth with de-forestation, industrialised agriculture, pestisides, the list goes on, is step two. 
            Step one starts a home, with you. You can choose to do no harm. Our personal destructive actions are likely done in ignorance, not usually in malice, and educating ourselves and children can overcome this.
            We have simply lost the ability to care about the small creatures. We may even be reviled by them.
            Yet people will stop in awe to watch a bird, listen to their song, but poison the slugs that eats their lettuce with little blue pellets. 
            Then who eats that slug for their lunch? The bird of course. The bird that was so admired.
            </p>
            <p>
            The smaller creatures and not insignificant, they are the foundation of the food chain. Without them, the world would be a very different place. So lets learn about them. And learn to love the role they play.
            Learning is how we unlock the magic. If you can identify that the slug eating your lettuce is called a Keeled Slug, you might not be so quick to kill it because you know it&apos;s name.
            And if you know it&apos;s name, you might be curious to learn more about it. And if you learn more about it, you might learn that it&apos;s a valuable part of the ecosystem. 
            So perhaps if you are fed up with the Keeled slug eating your lettuce, instead of introducing poison you might instead try to introduce some frogs by digging a little pond.
          </p>
          <p>
            To sum it up, theres a fork in the road, which path do you take - chemical warfare or natural harmony? 
            Garden Explorer is a tool to help you choose the path of natural harmony.
          </p>
        </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default About;
