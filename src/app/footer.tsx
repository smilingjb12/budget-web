export function Footer() {
  return (
    <div className="bg-secondary py-8">
      <div className="container mx-auto flex flex-col md:flex-row justify-between items-center px-4">
        <div className="text-center md:text-left mb-4 md:mb-0 space-y-2">
          <p className="text-sm text-primary-foreground">
            © 2024 ThumbScorer. All rights reserved.
          </p>
          <p className="text-sm text-primary-foreground">
            Contact:&nbsp;
            <a href="mailto:support@gmail.com" className="hover:text-primary">
              support@gmail.com
            </a>
          </p>
        </div>
        <nav className="flex gap-4">
          <a
            className="text-sm text-primary-foreground hover:text-primary"
            href="/privacy-policy"
          >
            Privacy Policy
          </a>
          <a
            className="text-sm text-primary-foreground hover:text-primary"
            href="/terms-of-service"
          >
            Terms of Service
          </a>
        </nav>
      </div>
    </div>
  );
}
