import { Wrench } from "@phosphor-icons/react"
import Link from 'next/link'

export default function ScanCode(){
    return(
        <Link className='flex fixed bottom-1 right-1 h-12 w-12 bg-amber-950 justify-center items-center rounded-full border-none' href="/service-orders/new">
            <Wrench size={23} color='white'/>
        </Link>
    )
}