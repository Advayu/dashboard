import Image from "next/image";
import instagram from "../../../public/image/ant-design_instagram-outlined.png";
import linkedin from "../../../public/image/ant-design_linkedin-outlined.png";
import LogoWithMessage from "../../app/utility/LogoWithMessage";
import JoinTheClubButton from "../ui/JoinTheClubButton";
import Link from "next/link";
const Footer = () => {
  return (
    <footer className="md:px-12 flex md:flex-row flex-col bg-gray-100 pb-32">
      <div className="mx-6 mt-4">
        <LogoWithMessage />
        <JoinTheClubButton text="Join the club" />
      </div>
      <div className="container mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 mt-14">
        {/* First Column */}

        <div>
          <ul>
            <li className="mb-1">
              <a href="#" className="hover:underline">
                For Businesses
              </a>
            </li>
            <li className="mb-1">
              <a href="#" className="hover:underline"></a>API
            </li>
            <li className="mb-1">
              <a href="#" className="hover:underline">
                Work@Advayu
              </a>
            </li>
          </ul>
        </div>
        {/* Second Column */}
        <div>
          <ul>
            <li className="mb-1">
              <a href="#" className="hover:underline">
                Blog
              </a>
            </li>
            <li className="mb-1">
              <a href="#" className="hover:underline">
                About Advayu
              </a>
            </li>
            <li className="mb-1">
              <a href="#" className="hover:underline">
                Contact Us
              </a>
            </li>
          </ul>
        </div>
        {/* Third Column */}
        <div>
          <ul>
            <li className="text-blueTilt">
              <a href="mailto:support@advayu.club">Support@advayu.club</a>
            </li>
            <li className="text-blueTilt">
              <a href="tel:+919123459789">+91 9660657811</a>
            </li>
          </ul>
        </div>
        {/* Fourth Column */}
        <div>
          <div className="flex space-x-4">
            <Link href="#" className="hover:underline">
              <Image src={linkedin} alt="Linkedin" className="w-6 h-6" />
            </Link>

            <Link
              href="https://www.instagram.com/advayu.club/"
              className="hover:underline"
              target="_blank"
              rel="noopener noreferrer">
              <Image src={instagram} alt="Instagram" className="w-6 h-6" />
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
