import { Link } from "react-router-dom"
import './styles/LandingPage.css'


export const LandingPage = () => {
     return <>
        <header>
    <div className="logo">Bible App</div>
    <nav>
      <ul>
        <li><Link to="/">Home</Link></li>
        <li><Link to="#about">About</Link></li>
        <li><Link to="/bible">Bible</Link></li>
        <li><Link to="#contact">Contact</Link></li>
      </ul>
    </nav>
  </header>

  {/* <!-- Hero Section --> */}
  <section className="hero" style={{backgroundImage:` background: linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)),
        url('https://images.unsplash.com/photo-1516979187457-637abb4f9353?auto=format&fit=crop&w=1950&q=80')
        no-repeat center center/cover;`}}>
    <h1>Welcome to the Bible App</h1>
    <p>Explore the Word of God with simplicity and peace. Read, reflect, and grow spiritually every day.</p>
    <Link to="/bible" className="cta">Open the Bible</Link>
  </section>

  {/* <!-- About the Author Section --> */}
  <section className="about" id="about">
    <h2>About the Creator & Sponsor</h2>
    <img src="https://i.postimg.cc/vHYnhtJ3/prophet-crissin.jpg" alt="Author Image" />
    <h3>Prophet Guy Crissin</h3>
    <p>
      Guy Crissin, the creator and sponsor of the Bible App, is a passionate believer dedicated to spreading the message of faith and love through technology. 
      His vision is to make the Holy Scriptures accessible to everyone, anywhere in the world, through a beautifully simple and inspiring experience.
    </p>
  </section>

  {/* <!-- Footer --> */}
  <footer id="contact">
    © { new Date().getFullYear() } Bible App | Sponsored by Prophet Guy Crissin. All Rights Reserved.
  </footer>
     </>             
}