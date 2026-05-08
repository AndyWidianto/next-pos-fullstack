
import { motion, AnimatePresence } from "framer-motion";


interface MotionProps {
    isOpen: boolean;
    onClose: () => void;
    children: React.ReactNode;
}
export const AnimateMotion = ({ isOpen, onClose, children }: MotionProps) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop / Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />

          {/* Modal Content */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", duration: 0.5, bounce: 0.3 }}
            className="relative rounded-2xl w-full overflow-hidden z-10"
          >
            {children}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};