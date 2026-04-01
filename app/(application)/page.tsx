'use client';
import Image from "next/image"
import styles from '@/styles/pages/home.module.css';
import HomePresentation from "@/components/application/sections/HomePresentation";
import AppBtn from "@/components/application/ui/buttons/AppBtn";
import { useRouter } from "next/navigation";

export default function HomePage() {
  const router = useRouter();

  return (<div className={styles.title}>
    <Image 
      src="/images/icons/logo-colors.svg" 
      alt="logo Agriguilder" 
      width={250} 
      height={150} 
    />
    <h2>Bienvenue sur Agriguilder !</h2>
    <HomePresentation />
    <AppBtn color="dark" label={"Se connecter"} onClick={() => router.push('/connexion')} />
  </div>);
}
