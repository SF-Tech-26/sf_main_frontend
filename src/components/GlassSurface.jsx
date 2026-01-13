import { useRef, useMemo } from 'react';

const GlassSurface = ({
    children,
    className = '',
    width = '100%',
    height = '100%',
    displace = 0,
    distortionScale = 20,
    redOffset = 0,
    greenOffset = 0,
    blueOffset = 0,
    brightness = 100,
    opacity = 1,
    mixBlendMode = 'normal',
    style = {}
}) => {
    const allowDisplacement = displace !== 0;

    // Unique ID for the filter to avoid conflicts if multiple instances usage
    const filterId = useMemo(() => `glass-filter-${Math.random().toString(36).substr(2, 9)}`, []);

    return (
        <div
            className={`glass-surface ${className}`}
            style={{
                position: 'relative',
                width,
                height,
                overflow: 'hidden',
                // Common base styles
                background: 'transparent',
                ...style
            }}
        >
            {/* 
        This is the "glass" layer that applies the SVG filter.
        We check if displacement is allowed to render the filter + backdrop.
      */}
            {allowDisplacement && (
                <>
                    <svg style={{ position: 'absolute', width: 0, height: 0 }}>
                        <filter id={filterId}>
                            <feTurbulence
                                type="fractalNoise"
                                baseFrequency={distortionScale / 1000}
                                numOctaves="3"
                                result="noise"
                            />
                            <feDisplacementMap
                                in="SourceGraphic"
                                in2="noise"
                                scale={displace}
                                xChannelSelector="R"
                                yChannelSelector="G"
                            />
                            <feComponentTransfer>
                                <feFuncR type="linear" slope="1" intercept={redOffset / 100} />
                                <feFuncG type="linear" slope="1" intercept={greenOffset / 100} />
                                <feFuncB type="linear" slope="1" intercept={blueOffset / 100} />
                            </feComponentTransfer>
                        </filter>
                    </svg>

                    <div
                        className="glass-surface-backdrop"
                        style={{
                            position: 'absolute',
                            inset: 0,
                            backdropFilter: `url(#${filterId}) brightness(${brightness}%)`,
                            WebkitBackdropFilter: `url(#${filterId}) brightness(${brightness}%)`,
                            opacity: opacity,
                            mixBlendMode: mixBlendMode,
                            zIndex: 0,
                            pointerEvents: 'none'
                        }}
                    />
                </>
            )}

            {/* Content Layer */}
            <div
                className="glass-content"
                style={{
                    position: 'relative',
                    zIndex: 1,
                    width: '100%',
                    height: '100%'
                }}
            >
                {children}
            </div>
        </div>
    );
};

export default GlassSurface;
