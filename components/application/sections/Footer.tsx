import packageJson from '@/package.json';
import Link from 'next/link';

export default function Footer() {
    const currentYear = new Date().getFullYear();
    return (<footer>
        <Link href={"/legal"}>Mentions légales</Link>
        <Link href={"/aide"}>Aide</Link>
        <p>v{packageJson.version} - copyright {currentYear}</p>
    </footer>);
}