export default function Footer() {
  return (
    <footer className="page-container py-16">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 tracking-wide">
        {/* Company Info */}
        <div className="space-y-4">
          <h3 className="text-2xl font-bold text-primary uppercase">
            Storewell
          </h3>
          <p className="text-primary-foreground font-normal">
            Curating the finest minimalist luxury for the modern intentional
            lifestyle.
          </p>
        </div>
        <div className="space-y-4">
          <h4 className="font-semibold text-primary uppercase text-xs">
            Collections
          </h4>
          <ul className="space-y-2 font-light text-sm">
            <li>
              <a
                href="#"
                className="text-primary-foreground hover:text-primary transition-colors"
              >
                New Arrivals
              </a>
            </li>
            <li>
              <a
                href="#"
                className="text-primary-foreground hover:text-primary transition-colors"
              >
                Best Sellers
              </a>
            </li>
            <li>
              <a
                href="#"
                className="text-primary-foreground hover:text-primary transition-colors"
              >
                The Editorial Edit
              </a>
            </li>
            <li>
              <a
                href="#"
                className="text-primary-foreground hover:text-primary transition-colors"
              >
                Limited Edition
              </a>
            </li>
          </ul>
        </div>

        <div className="space-y-4">
          <h4 className="font-semibold text-primary uppercase text-xs">
            Support
          </h4>
          <ul className="space-y-2 font-light text-sm">
            <li>
              <a
                href="#"
                className="text-primary-foreground hover:text-primary transition-colors"
              >
                Shipping & Returns
              </a>
            </li>
            <li>
              <a
                href="#"
                className="text-primary-foreground hover:text-primary transition-colors"
              >
                Size Guide
              </a>
            </li>
            <li>
              <a
                href="#"
                className="text-primary-foreground hover:text-primary transition-colors"
              >
                Sustainability
              </a>
            </li>
            <li>
              <a
                href="#"
                className="text-primary-foreground hover:text-primary transition-colors"
              >
                Contact Us
              </a>
            </li>
          </ul>
        </div>

        {/* Contact Info */}
        <div className="space-y-4">
          <h4 className="font-semibold text-primary uppercase text-xs">
            Follow
          </h4>
          <ul className="space-y-2 font-light text-sm">
            <li>
              <a
                href="#"
                className="text-primary-foreground hover:text-primary transition-colors"
              >
                Instagram
              </a>
            </li>
            <li>
              <a
                href="#"
                className="text-primary-foreground hover:text-primary transition-colors"
              >
                Pinterest
              </a>
            </li>
            <li>
              <a
                href="#"
                className="text-primary-foreground hover:text-primary transition-colors"
              >
                Tiktok
              </a>
            </li>
          </ul>
        </div>
      </div>
    </footer>
  );
}
