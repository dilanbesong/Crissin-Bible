 import '../styles/offline.css'
 
 
 const Offline = () => {
         const handleReload = () => window.location.reload()

      return <>
           <div className="offline-overlay">
                <div className="offline-card">
                    <span className="offline-icon" role="img" aria-label="Warning Sign">⚠️</span>
                    <h2>You are Offline</h2>
                    <p>
                        The application is currently disconnected from the internet. 
                        You can still access offline Bible passages, but network-dependent features like Audio Bible streaming will be unavailable.
                    </p>
                    <button className="offline-button" onClick={handleReload}>
                        Attempt to Reconnect (Reload)
                    </button>
                </div>
            </div>
      </>
      
}

export default Offline