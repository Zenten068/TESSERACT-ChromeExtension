# Tesseract - Password Analyzer

> A Chrome extension to analyze the strength of your passwords in real-time.

**Developed by TEAM CUBE**

## 📋 Overview

Tesseract is a powerful and visually appealing browser extension that provides instant feedback on password security. With real-time analysis, entropy calculations, and crack time estimates, users can create stronger, more secure passwords.

## ✨ Features

### 🔐 Password Analysis
- **Real-time Strength Assessment** - Instant feedback as you type
- **Visual Strength Indicator** - 5-segment color-coded strength bar
- **Entropy Calculation** - Measure password randomness and complexity
- **Crack Time Estimation** - Understand how long it would take to crack your password
- **Detailed Feedback** - Actionable suggestions to improve password strength

### 🎨 User Interface
- **Modern Design** - Clean, futuristic interface with smooth animations
- **Text Shuffle Animation** - Eye-catching effects for dynamic content
- **Show/Hide Password Toggle** - Conveniently view or mask your password

### 🔧 Additional Tools
- **Password Generator** - Create strong, random passwords
- **Custom Password Suggestions** - Get tailored recommendations
- **Responsive Layout** - Optimized for various screen sizes

## 🚀 Installation

### From Source

1. **Clone or download this repository**
   ```bash
   git clone <repository-url>
   ```

2. **Open Chrome and navigate to Extensions**
   ```
   chrome://extensions/
   ```

3. **Enable Developer Mode**
   - Toggle the "Developer mode" switch in the top-right corner

4. **Load the extension**
   - Click "Load unpacked"
   - Select the project directory

5. **Start using Tesseract**
   - Click the extension icon in your browser toolbar

## 🏗️ Project Structure

```
tesseract-password-analyzer/
├── manifest.json       # Extension configuration
├── popup.html         # Main popup interface
├── script.js          # Core logic and functionality
├── style.css          # Custom styles
├── tailwind.js        # Tailwind CSS framework
└── icons/            # Extension icons
    ├── logo16.png
    ├── logo48.png
    └── logo128.png
```

## 🛠️ Technologies Used

- **HTML5** - Structure and content
- **CSS3** - Styling and animations
- **JavaScript (ES6+)** - Core functionality
- **Tailwind CSS** - Utility-first CSS framework
- **Chrome Extension API** - Browser integration
- **Google Fonts** - Audiowide and Inter typefaces

## 🔍 How It Works

### Password Strength Calculation

The extension evaluates passwords based on multiple criteria:
- **Length** - Longer passwords are exponentially stronger
- **Character Variety** - Uppercase, lowercase, numbers, and special characters
- **Patterns** - Detection of common patterns and sequences
- **Entropy** - Randomness and unpredictability measurement
- **Dictionary Words** - Checking against common password lists

### Security Features

- **Local Processing** - All analysis happens locally in your browser
- **No Data Collection** - Your passwords never leave your device
- **No Network Requests** - Completely offline functionality
- **Privacy First** - Zero tracking or analytics

## 📊 Strength Ratings

| Rating | Color | Entropy Range | Security Level |
|--------|-------|---------------|----------------|
| Very Weak | Red | < 30 bits | vulnerable |
| Weak | Orange | 30-60 bits | Easily crackable |
| Fair | Yellow | 60-90 bits | Moderately secure |
| Strong | Green | 90-120 bits | Very strong |
| Very Strong | Cyan | > 120 bits | Excellent security |

## 🤝 Contributing

Contributions, issues, and feature requests are welcome! Feel free to check the issues page.

## 👥 Team

**TEAM CUBE** - Development Team

## 📧 Support

For support, feature requests, or bug reports, please open an issue in the repository.

---

**Made with ❤️ by TEAM CUBE**