import Navbar from './Navbar.jsx'
import Downloader from './Downloader.jsx'

function App () {
  return (
    <div className='App'>
      <header>
        <Navbar />
      </header>
      <main>
        <section>
          <Downloader />
        </section>
      </main>
    </div>
  )
}

export default App
