
const Footer = () => {
  return (
    <footer className="border-t border-black/5 bg-[#fafafa] px-4 py-6 text-center text-[0.8rem] text-[#888] md:px-10 md:py-10 md:text-[0.9rem]">
      <p>&copy; {new Date().getFullYear()} Anees Ark. All rights reserved.</p>
    </footer>
  );
};

export default Footer;