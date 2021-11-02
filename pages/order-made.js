import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import { useEffect, useState } from 'react'
import axios from 'axios'
import { useCart } from '../context/CartContext'
import OrderSuccessfullyMade from '../components/OrderSuccessfullyMade'

export default function OderMade() {

  const { cart } = useCart()

  return (
    <div className={styles.container}>
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <OrderSuccessfullyMade />
      </main>

      <footer className={styles.footer}>

      </footer>
    </div>
  )
}


