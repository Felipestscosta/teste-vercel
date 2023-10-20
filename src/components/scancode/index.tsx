import { WrenchIcon } from '@heroicons/react/24/solid'
import Link from 'next/link'

export default function ScanCode(){
    return(
        <Link className='flex fixed bottom-4 right-4 h-16 w-16 bg-gray-100 justify-center items-center rounded-full border-none shadow-lg' href="/service-orders/new">
            <WrenchIcon className='h-6 text-amber-950'/>
        </Link>
    )
}