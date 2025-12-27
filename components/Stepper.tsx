import React, { useState, Children, useRef, useLayoutEffect, HTMLAttributes, ReactNode } from 'react';
import { motion, AnimatePresence, Variants } from 'motion/react';
import type { SVGProps } from 'react';

interface StepperProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  initialStep?: number;
  onStepChange?: (step: number) => void;
  onFinalStepCompleted?: () => void;
  stepCircleContainerClassName?: string;
  stepContainerClassName?: string;
  contentClassName?: string;
  footerClassName?: string;
  backButtonProps?: React.ButtonHTMLAttributes<HTMLButtonElement>;
  nextButtonProps?: React.ButtonHTMLAttributes<HTMLButtonElement>;
  backButtonText?: string;
  nextButtonText?: string;
  disableStepIndicators?: boolean;
  renderStepIndicator?: (props: RenderStepIndicatorProps) => ReactNode;
}

interface RenderStepIndicatorProps {
  step: number;
  currentStep: number;
  onStepClick: (clicked: number) => void;
}

export default function Stepper({
  children,
  initialStep = 1,
  onStepChange = () => {},
  onFinalStepCompleted = () => {},
  stepCircleContainerClassName = '',
  stepContainerClassName = '',
  contentClassName = '',
  footerClassName = '',
  backButtonProps = {},
  nextButtonProps = {},
  backButtonText = 'Back',
  nextButtonText = 'Continue',
  disableStepIndicators = false,
  renderStepIndicator,
  ...rest
}: StepperProps) {
  const [currentStep, setCurrentStep] = useState<number>(initialStep);
  const [direction, setDirection] = useState<number>(0);
  const stepsArray = Children.toArray(children);
  const totalSteps = stepsArray.length;
  const isCompleted = currentStep > totalSteps;
  const isLastStep = currentStep === totalSteps;

  const updateStep = (newStep: number) => {
    setCurrentStep(newStep);
    if (newStep > totalSteps) {
      onFinalStepCompleted();
    } else {
      onStepChange(newStep);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setDirection(-1);
      updateStep(currentStep - 1);
    }
  };

  const handleNext = () => {
    if (!isLastStep) {
      setDirection(1);
      updateStep(currentStep + 1);
    }
  };

  const handleComplete = () => {
    setDirection(1);
    updateStep(totalSteps + 1);
  };

  const progressWidth = totalSteps > 1 ? `${((currentStep - 1) / (totalSteps - 1)) * 84}%` : '0%';
  // 84% = 100% - 16% padding (8% each side)

  return (
    <div className="w-full px-4 py-8 md:py-12" {...rest}>
      {/* Pill-Shaped Progress Bar */}
      <div className={`mb-12 md:mb-16 rounded-full bg-white/5 backdrop-blur-md border border-white/20 p-4 shadow-2xl shadow-black/50 ${stepCircleContainerClassName}`}>
        <div className="flex items-center justify-between relative">
          {/* Background Track */}
          <div className="absolute inset-x-8 top-1/2 h-2 bg-white/10 rounded-full -translate-y-1/2" />

          {stepsArray.map((_, index) => {
            const stepNumber = index + 1;
            const isActive = currentStep === stepNumber;
            const isComplete = currentStep > stepNumber;

            return (
              <div key={stepNumber} className="relative z-10 flex-1 flex justify-center">
                <motion.div
                  onClick={() => {
                    if (!disableStepIndicators && stepNumber !== currentStep) {
                      setDirection(stepNumber > currentStep ? 1 : -1);
                      updateStep(stepNumber);
                    }
                  }}
                  className={`
                    w-12 h-12 md:w-16 md:h-16 rounded-full flex items-center justify-center text-lg md:text-2xl font-black
                    transition-all duration-500 shadow-lg cursor-pointer
                    ${isComplete ? 'bg-white text-black shadow-white/40' : ''}
                    ${isActive ? 'bg-white text-black ring-4 ring-white/30 scale-110 shadow-2xl' : ''}
                    ${!isComplete && !isActive ? 'bg-black/60 border-3 border-white/40 text-white/80 backdrop-blur-sm' : ''}
                  `}
                  whileHover={{ scale: !disableStepIndicators ? 1.2 : 1 }}
                  whileTap={{ scale: !disableStepIndicators ? 0.95 : 1 }}
                >
                  {isComplete ? (
                    <CheckIcon className="w-6 h-6 md:w-8 md:h-8" />
                  ) : (
                    stepNumber
                  )}
                </motion.div>
              </div>
            );
          })}

          {/* Animated Progress Fill */}
          <motion.div
            className="absolute left-8 top-1/2 h-2 bg-white rounded-full -translate-y-1/2"
            initial={{ width: '0%' }}
            animate={{ width: progressWidth }}
            transition={{ duration: 0.8, ease: 'easeInOut' }}
          />
        </div>
      </div>

      {/* Content Area */}
      <div className={`mb-16 md:mb-24 ${contentClassName || ''}`}>
        <StepContentWrapper
          isCompleted={isCompleted}
          currentStep={currentStep}
          direction={direction}
        >
          {stepsArray[currentStep - 1]}
        </StepContentWrapper>
      </div>

      {/* Footer – Clean & Responsive */}
      {!isCompleted && (
        <div className={`flex flex-col md:flex-row justify-between items-center gap-8 ${footerClassName || ''}`}>
          <button
            onClick={handleBack}
            disabled={currentStep === 1}
            className={`
              w-full md:w-auto px-10 py-5 text-xl md:text-2xl font-medium rounded-3xl transition-all duration-300
              ${currentStep === 1 
                ? 'text-white/20 cursor-not-allowed' 
                : 'text-white bg-white/8 hover:bg-white/15 border-3 border-white/30 backdrop-blur-md shadow-lg'
              }
            `}
            {...backButtonProps}
          >
            {backButtonText}
          </button>

          <button
            onClick={isLastStep ? handleComplete : handleNext}
            className="w-full md:w-auto px-14 py-6 text-2xl md:text-3xl font-black text-black bg-white rounded-3xl hover:bg-gray-100 shadow-3xl shadow-white/60 transition-all duration-300 hover:scale-105 active:scale-95"
            {...nextButtonProps}
          >
            {isLastStep ? 'Complete' : nextButtonText}
          </button>
        </div>
      )}
    </div>
  );
}

interface StepContentWrapperProps {
  isCompleted: boolean;
  currentStep: number;
  direction: number;
  children: ReactNode;
}

function StepContentWrapper({ isCompleted, currentStep, direction, children }: StepContentWrapperProps) {
  const [parentHeight, setParentHeight] = useState<number>(0);

  return (
    <motion.div
      style={{ position: 'relative', overflow: 'hidden' }}
      animate={{ height: isCompleted ? 0 : parentHeight }}
      transition={{ type: 'spring', stiffness: 300, damping: 32 }}
    >
      <AnimatePresence initial={false} mode="wait" custom={direction}>
        {!isCompleted && (
          <SlideTransition key={currentStep} direction={direction} onHeightReady={setParentHeight}>
            {children}
          </SlideTransition>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

interface SlideTransitionProps {
  children: ReactNode;
  direction: number;
  onHeightReady: (h: number) => void;
}

function SlideTransition({ children, direction, onHeightReady }: SlideTransitionProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useLayoutEffect(() => {
    if (containerRef.current) {
      onHeightReady(containerRef.current.offsetHeight);
    }
  }, [children, onHeightReady]);

  return (
    <motion.div
      ref={containerRef}
      custom={direction}
      variants={stepVariants}
      initial="enter"
      animate="center"
      exit="exit"
      transition={{ duration: 0.6, ease: 'easeInOut' }}
      style={{ position: 'absolute', width: '100%', left: 0, top: 0 }}
    >
      {children}
    </motion.div>
  );
}

const stepVariants: Variants = {
  enter: (dir: number) => ({
    x: dir >= 0 ? '100%' : '-100%',
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
  },
  exit: (dir: number) => ({
    x: dir >= 0 ? '-50%' : '50%',
    opacity: 0,
  }),
};

export function Step({ children }: { children: ReactNode }) {
  return <div className="w-full">{children}</div>;
}

function CheckIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="6">
      <motion.path
        d="M5 13l4 4L19 7"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}