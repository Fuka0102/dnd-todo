import Link from "next/link"

export default function Button ({ link, text }:{ link: string, text: string }) {
    return (
        <Link href={link}>
            {text}
        </Link>
    )
}