// src/components/ui/AnimatedButton.jsx
import { motion } from 'framer-motion';

/**
 * AnimatedButton Component
 * Interactive button with hover and tap scale animations
 * 
 * @param {Object} props
 * @param {React.ReactNode} props.children - Button content
 * @param {string} props.className - CSS classes for styling
 * @param {Function} props.onClick - Click handler
 * @param {string} props.type - Button type (button, submit, reset)
 * @param {boolean} props.disabled - Disabled state
 * @param {Object} rest - All other props passed to button element
 */
const AnimatedButton = ({
    children,
    className = '',
    onClick,
    type = 'button',
    disabled = false,
    ...rest
}) => {
    return (
        <motion.button
            type={type}
            onClick={onClick}
            disabled={disabled}
            className={className}
            whileHover={{ scale: disabled ? 1 : 1.02 }}
            whileTap={{ scale: disabled ? 1 : 0.95 }}
            transition={{ duration: 0.2 }}
            {...rest}
        >
            {children}
        </motion.button>
    );
};

export default AnimatedButton;
