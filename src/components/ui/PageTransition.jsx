// src/components/ui/PageTransition.jsx
import { motion } from 'framer-motion';

/**
 * PageTransition Component
 * Wraps page content with smooth fade and slide animations
 * 
 * @param {Object} props
 * @param {React.ReactNode} props.children - Content to animate
 * @param {number} props.duration - Animation duration in seconds (default: 0.3)
 */
const PageTransition = ({ children, duration = 0.3 }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration }}
        >
            {children}
        </motion.div>
    );
};

export default PageTransition;
