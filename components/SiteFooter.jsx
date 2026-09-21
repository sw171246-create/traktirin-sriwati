import { Heart } from "lucide-react";

export default function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="container wide">
        <p className="footer-text">
          Dibuat dengan <Heart size={16} className="heart-icon" /> by{" "}
          <a
            href="https://www.instagram.com/harisgunawanr_"
            className="author-link"
          >
            Haris Gunawan Romadon
          </a>
        </p>
      </div>
    </footer>
  );
}
