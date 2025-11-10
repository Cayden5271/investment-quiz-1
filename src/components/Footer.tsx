import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-6 mt-12">
      <div className="max-w-6xl mx-auto px-4">
        <div className="border-t border-gray-700 pt-4">
          <p className="text-sm text-red-300 font-semibold mb-2">
            ⚠️ Important Disclaimer
          </p>
          <p className="text-xs text-gray-300 leading-relaxed">
            This tool is for <strong>educational purposes only</strong> and{' '}
            <strong>is not financial advice</strong>. Investing involves risk, including loss of principal.
            Consider consulting a <strong>fiduciary financial professional</strong> for personalized advice.
            Past performance does not guarantee future results.
          </p>
          <div className="mt-4 flex flex-wrap gap-4 text-xs text-gray-400">
            <Link to="/" className="hover:text-white">Home</Link>
            <Link to="/learn" className="hover:text-white">Learn More</Link>
          </div>
          <p className="mt-4 text-xs text-gray-500">
            © {new Date().getFullYear()} Investment Quiz. Educational tool only.
          </p>
        </div>
      </div>
    </footer>
  );
}

