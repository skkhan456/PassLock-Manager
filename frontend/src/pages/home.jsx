import React from 'react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import Manager from '../components/Manager'

const home = () => {
  return (
    <>
      <Navbar/>
      <div className="flex flex-col min-h-screen">
        <main className="flex-grow">
          <Manager/>
        </main>
        <Footer />
      </div>
    </>
  )
}

export default home