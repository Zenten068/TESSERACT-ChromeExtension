const passwordInput = document.getElementById('password-input');
        const strengthText = document.getElementById('strength-text');
        const feedbackContainer = document.getElementById('feedback-container');
        const togglePasswordBtn = document.getElementById('toggle-password');
        const eyeOpen = document.getElementById('eye-open');
        const eyeClosed = document.getElementById('eye-closed');
        const analysisBox = document.getElementById('analysis-box');
        const crackTimeText = document.getElementById('crack-time-text');
        const entropyText = document.getElementById('entropy-text');
        const scoreText = document.getElementById('score-text');
        const segments = [
            document.getElementById('segment-1'),
            document.getElementById('segment-2'),
            document.getElementById('segment-3'),
            document.getElementById('segment-4'),
            document.getElementById('segment-5')
        ];
        const generatorInput = document.getElementById('generator-input');
        const generateBtn = document.getElementById('generate-btn');
        const suggestionContainer = document.getElementById('suggestion-container');
        
        // --- TEXT SHUFFLE ANIMATION ---
        function animateShuffle(span, originalChar, index, options) {
            const { duration, shuffle, stagger } = options;
            const delay = index * stagger;
            const shuffleStepDuration = duration / shuffle;
            const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890@#$&*';

            setTimeout(() => {
                let currentShuffle = 0;
                function doShuffle() {
                    if (currentShuffle >= shuffle) {
                        span.textContent = originalChar;
                        return;
                    }
                    span.textContent = chars[Math.floor(Math.random() * chars.length)];
                    currentShuffle++;
                    setTimeout(doShuffle, shuffleStepDuration * 1000);
                }
                doShuffle();
            }, delay * 1000);
        }

        function applyShuffleText(element, options) {
            const text = element.dataset.originalText || element.textContent;
            element.dataset.originalText = text; // Store original text
            const letters = text.split('');
            element.textContent = ''; // Clear the element for spans

            letters.forEach((letter, i) => {
                const span = document.createElement('span');
                span.textContent = letter;
                span.style.display = 'inline-block'; // Handles spaces correctly
                element.appendChild(span);
                if (letter.trim() !== '') { // Don't animate spaces
                    animateShuffle(span, letter, i, options);
                }
            });
        }
        
        // --- SCORE COUNT UP ANIMATION ---
        function animateCountUp(element, endValue, duration = 400) {
            let startTimestamp = null;
            const initialValue = parseInt(element.textContent) || 0;
            if (initialValue === endValue) return;

            const step = (timestamp) => {
                if (!startTimestamp) startTimestamp = timestamp;
                const progress = Math.min((timestamp - startTimestamp) / duration, 1);
                const currentValue = Math.floor(progress * (endValue - initialValue) + initialValue);
                element.textContent = currentValue;
                if (progress < 1) {
                    window.requestAnimationFrame(step);
                }
            };
            window.requestAnimationFrame(step);
        }


        // --- Event Listeners ---
        passwordInput.addEventListener('input', () => {
            const password = passwordInput.value;
            const strength = checkPasswordStrength(password);
            updateUI(strength);
        });

        togglePasswordBtn.addEventListener('click', () => {
            const isPassword = passwordInput.type === 'password';
            passwordInput.type = isPassword ? 'text' : 'password';
            eyeOpen.style.display = isPassword ? 'none' : 'block';
            eyeClosed.style.display = isPassword ? 'block' : 'none';
        });

        generateBtn.addEventListener('click', () => {
            const baseWord = generatorInput.value.trim();
            if (!baseWord) {
                generatorInput.focus();
                generatorInput.classList.add('animate-shake');
                setTimeout(() => generatorInput.classList.remove('animate-shake'), 500);
                return;
            }
            
            suggestionContainer.innerHTML = '';
            for (let i = 0; i < 3; i++) {
                const newPassword = generateStrongPassword(baseWord);
                const suggestionEl = document.createElement('div');
                suggestionEl.className = 'p-3 bg-slate-100 dark:bg-slate-700 rounded-lg flex justify-between items-center transition-all hover:bg-slate-200 dark:hover:bg-slate-600';
                suggestionEl.innerHTML = `
                    <p class="password-text text-lg font-mono text-slate-800 dark:text-white truncate cursor-pointer flex-grow" data-password="${newPassword}">${newPassword}</p>
                    <button class="copy-btn p-2 text-slate-500 dark:text-slate-400 hover:bg-slate-300 dark:hover:bg-slate-500 rounded-md transition-colors flex-shrink-0" aria-label="Copy password" data-password="${newPassword}">
                         <svg class="copy-icon" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-copy"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>
                         <svg class="check-icon hidden" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-check text-green-500"><path d="M20 6 9 17l-5-5"/></svg>
                    </button>
                `;
                suggestionContainer.appendChild(suggestionEl);
            }

            suggestionContainer.classList.remove('hidden');
        });

        suggestionContainer.addEventListener('click', (e) => {
            const copyBtn = e.target.closest('.copy-btn');
            const passwordText = e.target.closest('.password-text');

            if (copyBtn) {
                const passwordToCopy = copyBtn.dataset.password;
                const textArea = document.createElement('textarea');
                textArea.value = passwordToCopy;
                textArea.style.position = 'fixed';
                textArea.style.left = '-9999px';
                textArea.setAttribute('readonly', '');

                document.body.appendChild(textArea);
                textArea.select();
                
                try {
                    document.execCommand('copy');
                    const copyIcon = copyBtn.querySelector('.copy-icon');
                    const checkIcon = copyBtn.querySelector('.check-icon');
                    copyIcon.classList.add('hidden');
                    checkIcon.classList.remove('hidden');
                    setTimeout(() => {
                        copyIcon.classList.remove('hidden');
                        checkIcon.classList.add('hidden');
                    }, 2000);
                } catch (err) {
                    console.error('Failed to copy password: ', err);
                }

                document.body.removeChild(textArea);
            } else if (passwordText) {
                const passwordToAnalyze = passwordText.dataset.password;
                passwordInput.value = passwordToAnalyze;
                passwordInput.dispatchEvent(new Event('input', { bubbles: true }));
                
                // Scroll to the password input field for better UX
                document.getElementById('password-input').scrollIntoView({ behavior: 'smooth' });
            }
        });

        // --- Core Logic ---
        function checkPasswordStrength(password) {
            let score = 0;
            const feedback = [];
            
            if (!password) {
                return { score: 0, feedback: [], crackTime: '-', entropy: 0 };
            }

            // --- Character Pool & Entropy Calculation ---
            let characterPool = 0;
            if (/[a-z]/.test(password)) { characterPool += 26; }
            if (/[A-Z]/.test(password)) { characterPool += 26; }
            if (/[0-9]/.test(password)) { characterPool += 10; }
            if (/[^A-Za-z0-9]/.test(password)) { characterPool += 32; } // Common special characters
            
            const entropy = password.length * Math.log2(characterPool || 1);

            // --- Time to Crack Estimation ---
            const guessesPerSecond = 1e8; // 100 million guesses per second
            const secondsToCrack = Math.pow(2, entropy) / guessesPerSecond;
            const crackTime = formatTime(secondsToCrack);

            // --- Scoring based on Entropy and other factors ---
            let tempScore = 0;
            if (entropy < 28) tempScore = (entropy / 28) * 25;
            else if (entropy < 45) tempScore = 25 + ((entropy - 28) / 17) * 25;
            else if (entropy < 60) tempScore = 50 + ((entropy - 45) / 15) * 25;
            else tempScore = 75 + Math.min(25, ((entropy - 60) / 20) * 25);
            score = Math.floor(tempScore);
            
            // --- Common Password & Pattern Penalties ---
            const commonPasswords = new Set(["123456", "password", "123456789", "12345", "qwerty", "12345678", "111111", "123123", "password123", "admin"]);
            const repetitiveChars = /(.)\1{2,}/.test(password);
            const commonSequences = /abc|bcd|cde|123|234|345|qwe|wer|ert|asd|sdf|dfg|zxc|xcv|cvb/.test(password.toLowerCase());

            if (commonPasswords.has(password.toLowerCase())) {
                score = 5;
                feedback.push({ message: "Avoid using extremely common passwords", satisfied: false });
            }
            if (repetitiveChars) {
                score = Math.max(0, score - 25);
                feedback.push({ message: "Avoid repetitive characters (e.g., 'aaa')", satisfied: false });
            }
             if (commonSequences) {
                score = Math.max(0, score - 20);
                feedback.push({ message: "Avoid keyboard sequences (e.g., 'abc', 'qwe')", satisfied: false });
            }

            // --- Qualitative Feedback Checklist ---
            feedback.push({ message: "At least 8 characters long", satisfied: password.length >= 8 });
            feedback.push({ message: "Contains an uppercase letter", satisfied: /[A-Z]/.test(password) });
            feedback.push({ message: "Contains a lowercase letter", satisfied: /[a-z]/.test(password) });
            feedback.push({ message: "Contains a number", satisfied: /[0-9]/.test(password) });
            feedback.push({ message: "Contains a special character", satisfied: /[^A-Za-z0-9]/.test(password) });

            score = Math.max(0, Math.min(100, score));

            return { score, feedback, crackTime, entropy: entropy.toFixed(1) };
        }

        function formatTime(seconds) {
            if (seconds < 1) return "Instantly";
            if (seconds < 60) return `${Math.ceil(seconds)} seconds`;
            const minutes = seconds / 60;
            if (minutes < 60) return `${Math.ceil(minutes)} minutes`;
            const hours = minutes / 60;
            if (hours < 24) return `${Math.ceil(hours)} hours`;
            const days = hours / 24;
            if (days < 365) return `${Math.ceil(days)} days`;
            const years = days / 365;
            if (years < 1000) return `${Math.ceil(years)} years`;
            if (years < 1e6) return `${Math.ceil(years / 1000)} thousand years`;
            return "Millions of years";
        }

        // --- UI Update ---
        function updateUI(strength) {
            const { score, feedback, crackTime, entropy } = strength;
            
            // --- Update Strength Segments & Text ---
            let barColors = Array(5).fill('bg-slate-200 dark:bg-slate-700');
            let textLabel = '';
            let textColor = 'text-slate-500 dark:text-slate-400';
            
            if (passwordInput.value.length === 0) {
                strengthText.innerHTML = '&nbsp;';
                analysisBox.classList.add('hidden');
            } else if (score < 30) {
                barColors[0] = 'bg-gradient-to-r from-red-500 to-orange-400';
                textLabel = 'Very Weak';
                textColor = 'text-red-500';
            } else if (score < 50) {
                barColors[0] = barColors[1] = 'bg-gradient-to-r from-orange-500 to-amber-400';
                textLabel = 'Weak';
                textColor = 'text-orange-500';
            } else if (score < 75) {
                barColors[0] = barColors[1] = barColors[2] = 'bg-gradient-to-r from-yellow-400 to-lime-500';
                textLabel = 'Moderate';
                textColor = 'text-yellow-500';
            } else if (score < 90) {
                barColors.fill('bg-gradient-to-r from-lime-500 to-green-500', 0, 4);
                textLabel = 'Strong';
                textColor = 'text-green-500';
            } else {
                barColors.fill('bg-gradient-to-r from-green-400 to-cyan-400');
                textLabel = 'Very Strong';
                textColor = 'text-cyan-400';
            }

            segments.forEach((seg, i) => seg.className = `strength-segment h-2 w-1/5 rounded-full ${barColors[i]}`);
            strengthText.textContent = textLabel;
            strengthText.className = `text-sm text-right mt-1.5 font-bold ${textColor}`;

            // --- Update Analysis Box ---
            if(passwordInput.value.length > 0){
                analysisBox.classList.remove('hidden');
                analysisBox.classList.add('fade-in');
                crackTimeText.textContent = crackTime;
                entropyText.textContent = `${entropy} bits`;
                animateCountUp(scoreText, score);
            } else {
                analysisBox.classList.add('hidden');
                analysisBox.classList.remove('fade-in');
                scoreText.textContent = '-'; // Reset score text directly
            }
            
            // --- Update Feedback List ---
            feedbackContainer.innerHTML = '';
            const feedbackList = document.createElement('ul');
            feedbackList.className = 'space-y-2';

            const uniqueMessages = new Map();
            feedback.forEach(item => uniqueMessages.set(item.message, item.satisfied));
            
            uniqueMessages.forEach((satisfied, message) => {
                const li = document.createElement('li');
                li.className = 'flex items-center text-sm feedback-item';
                
                const iconSVG = satisfied 
                    ? `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="text-green-500 mr-2.5 flex-shrink-0"><path d="M20 6 9 17l-5-5"/></svg>`
                    : `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="text-slate-400 dark:text-slate-500 mr-2.5 flex-shrink-0"><line x1="18" x2="6" y1="6" y2="18"/><line x1="6" x2="18" y1="6" y2="18"/></svg>`;

                const textClass = satisfied ? 'text-slate-700 dark:text-slate-300' : 'text-slate-500 dark:text-slate-400';
                
                li.innerHTML = `${iconSVG}<span class="${textClass}">${message}</span>`;
                feedbackList.appendChild(li);
            });
            feedbackContainer.appendChild(feedbackList);
        }

        /**
         * Generates a strong, memorable password based on a user-provided word.
         * @param {string} baseWord - The word to base the password on.
         * @returns {string} A randomly generated strong password.
         */
        function generateStrongPassword(baseWord) {
            // Check if the original input has a number.
            const hasNumber = /[0-9]/.test(baseWord);

            // Sanitize baseWord to remove unwanted symbols, but keep letters and numbers.
            let cleanedBase = baseWord.replace(/[^a-zA-Z0-9]/g, '');
            if (!cleanedBase) { // Provide a fallback if the input is empty or only symbols.
                cleanedBase = "Random";
            }
            
            // Library of 100 diverse keywords for high randomization
            const keywords = [
                // Nature
                "Forest", "River", "Mountain", "Glacier", "Ocean", "Desert", "Tundra", "Volcano", "Canyon", "Island",
                "Sunrise", "Sunset", "Starlight", "Nebula", "Galaxy", "Comet", "Meteor", "Planet", "Cosmos", "Quasar",
                // Animals
                "Lion", "Tiger", "Eagle", "Falcon", "Wolf", "Shark", "Dragon", "Phoenix", "Griffin", "Kraken",
                "Elephant", "Panther", "Scorpion", "Cobra", "Viper", "Jaguar", "Leopard", "Dolphin", "Whale", "Octopus",
                // Technology
                "Cyber", "Digital", "Matrix", "Vector", "Code", "Cipher", "Signal", "Pulse", "Robot", "Android",
                "Circuit", "Voltage", "Laser", "Plasma", "Kernel", "Firewall", "Protocol", "Algorithm", "Byte", "Pixel",
                // Concepts & Adjectives
                "Secret", "Hidden", "Silent", "Quantum", "Atomic", "Eternal", "Infinite", "Arcane", "Shadow", "Phantom",
                "Crimson", "Azure", "Golden", "Silver", "Obsidian", "Emerald", "Crystal", "Diamond", "Vortex", "Abyss",
                // Objects & Misc
                "Castle", "Fortress", "Anchor", "Hammer", "Sword", "Shield", "Arrow", "Compass", "Key", "Chronos",
                "Oracle", "Talisman", "Rune", "Warden", "Sentinel", "Guardian", "Echo", "Mirage", "Zenith", "Omega"
            ];
            const symbols = "!@#$%*?&";
            
            // Generate a random number, to be used only if the baseWord doesn't have one.
            const randomNumber = Math.floor(10 + Math.random() * 990);
            
            // Pick a random symbol.
            const randomSymbol = symbols[Math.floor(Math.random() * symbols.length)];

            let parts;

            // Adapt password generation based on the input keyword length
            if (cleanedBase.length >= 10) {
                // If keyword is long, only add symbol (and number if missing)
                parts = [cleanedBase, randomSymbol];
            } else if (cleanedBase.length >= 6) {
                // If keyword is medium length, add a short random word
                const shortKeywords = keywords.filter(k => k.length <= 5);
                const randomShortKeyword = shortKeywords[Math.floor(Math.random() * shortKeywords.length)] || "Key"; // fallback
                parts = [cleanedBase, randomShortKeyword, randomSymbol];
            } else {
                // If keyword is short, add any random word
                const randomKeyword = keywords[Math.floor(Math.random() * keywords.length)];
                parts = [cleanedBase, randomKeyword, randomSymbol];
            }
            
            // Conditionally add the random number if the original keyword didn't have one
            if (!hasNumber) {
                parts.push(randomNumber);
            }

            // Shuffle the parts array for true randomness
            for (let i = parts.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [parts[i], parts[j]] = [parts[j], parts[i]]; // Swap elements
            }
            
            let finalPassword = parts.join('');

            // Randomize the case of all letters in the string
            finalPassword = Array.from(finalPassword).map(char => {
                if (/[a-zA-Z]/.test(char)) { // Check if it's a letter
                    return Math.random() > 0.5 ? char.toUpperCase() : char.toLowerCase();
                }
                return char; // Return numbers/symbols as is
            }).join('');
            
            // Pad the password with random characters if it's less than 14 characters
            const paddingChars = "abcdefghijklmnopqrstuvwxyz0123456789";
            while (finalPassword.length < 14) {
                finalPassword += paddingChars[Math.floor(Math.random() * paddingChars.length)];
            }

            // Ensure password is not longer than 18 characters
            if (finalPassword.length > 18) {
                finalPassword = finalPassword.substring(0, 18);
            }

            return finalPassword;
        }

        // --- Initializations ---
        document.addEventListener('DOMContentLoaded', () => {
            // Title Animation
            const titleElement = document.querySelector('h1.text-glow-gradient');
            if(titleElement) {
                applyShuffleText(titleElement, {
                    duration: 0.4, // seconds
                    shuffle: 4,    // times per character
                    stagger: 0.08  // seconds between characters
                });
            }
        });