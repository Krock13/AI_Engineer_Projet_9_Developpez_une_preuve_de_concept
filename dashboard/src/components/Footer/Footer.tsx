import "./Footer.css";

function Footer() {
  return (
    <footer className="footer">
      <p>
        &copy; {new Date().getFullYear()} Mon Dashboard. Tous droits réservés.
      </p>
    </footer>
  );
}

export default Footer;
