import React from "react";
import { assets } from "../assets/assets";
import { Github, Twitter, Instagram, Linkedin } from "lucide-react";

const Footer =()=>{
  return(
    <footer className="px-6  md:px-16 lg:px-36 mt-40 w-full text-gray-300">
            <div className="flex flex-col md:flex-row justify-between w-full gap-10 border-b border-gray-500 pb-14">
                <div className="md:max-w-96">
                    <img alt="" className="w-56 h-20" src={assets.logo}/>
                    <p className="mt-6 text-sm">
                        One Show is your premier destination for movie ticket booking. Discover the latest blockbusters, book your favorite seats, and enjoy an unparalleled cinema experience. With seamless booking, secure payments, and exclusive offers, we bring the magic of movies to your fingertips.
                    </p>
                    <div className="flex items-center gap-2 mt-4">
                        <img src={assets.googlePlay} alt="google play" className="h-10 w-auto" />
                        <img src={assets.appStore} alt="app store" className="h-9 w-auto" />
                    </div>
                </div>
                <div className="flex-1 flex items-start md:justify-end gap-20 md:gap-40">
                    <div>
                        <h2 className="font-semibold mb-5">Company</h2>
                        <ul className="text-sm space-y-2">
                            <li><a href="#">Home</a></li>
                            <li><a href="#">About us</a></li>
                            <li><a href="#">Contact us</a></li>
                            <li><a href="#">Privacy policy</a></li>
                        </ul>
                    </div>
                    <div>
                        <h2 className="font-semibold mb-5">Get in touch</h2>
                        <div className="text-sm space-y-2">
                            <p>+1-234-567-890</p>
                            <p>contact@example.com</p>
                        </div>
                        <div className="flex items-center gap-4 mt-6">
                            <a href="https://github.com/iqyanali17/" className="text-gray-400 hover:text-white transition-colors">
                                <Github className="w-5 h-5" />
                            </a>
                            <a href="#" className="text-gray-400 hover:text-white transition-colors">
                                <Twitter className="w-5 h-5" />
                            </a>
                            <a href="#" className="text-gray-400 hover:text-white transition-colors">
                                <Instagram className="w-5 h-5" />
                            </a>
                            <a href="www.linkedin.com/in/khwaja-iqyan-ali-17-a-" className="text-gray-400 hover:text-white transition-colors">
                                <Linkedin className="w-5 h-5" />
                            </a>
                        </div>
                    </div>
                </div>
            </div>
            <p className="pt-4 text-center text-sm pb-5">
                Copyright {new Date().getFullYear()} &copy; <a href="https://prebuiltui.com">One Show</a>. All Right Reserved.
            </p>
        </footer>
  )
}

export default Footer;