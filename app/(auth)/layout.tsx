import Image from 'next/image'
import React from 'react'

const Layout = ({ children }: { children: React.ReactNode }) => {
    return (
        <div className='flex min-h-screen'>
            <section className='bg-brand p-10 hidden w-1/2 items-center justify-center lg:flex xl:w-2/5'>
                <div className='flex max-h-[800px] max-w-[430px] flex-col justify-center space-y-12'>
                    <Image src="/assets/images/Logo.png" alt='logo' width={350} height={82} className='h-auto' />
                    <div className='space-y-5 text-white'>
                        <h1 className='h1'>Track your meals and monitor your progress the best way!</h1>
                        <p className='body-1'>Join our community and start your journey towards a healthier lifestyle.</p>
                    </div>
                    <div>
                        <Image src="/assets/images/layoutImg.svg" alt='files' width={500} height={342} className='transition-all hover:rotate-2 hover:scale-105' />
                    </div>
                </div>
            </section>

            <section className='flex flex-1 flex-col items-center bg-white p-4 py-10 lg:justify-center lg:p-10 lg:py-0'>
                <div className='mb-16 lg:hidden '>
                    <Image src="/assets/images/logo.png" alt='logo' width={300} height={82} className='lg:w-[250px]' />
                </div>
                {children}
            </section>
        </div>
    )
}

export default Layout
