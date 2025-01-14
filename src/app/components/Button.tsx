import Link from "next/link"

export default function Button ({ link, text }:{ link: string, text: string }) {
    return (
        <Link href={link} className="flex px-2 py-1.5 bg-black text-white border-solid border-2 border-black hover:bg-white hover:text-black hover:border-black">
            {text}
        </Link>
    )
}