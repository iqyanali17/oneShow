const BlurCircle = ({ 
    top = "auto", 
    right = "auto", 
    bottom = "auto", 
    left = "auto",
    size = "20rem",
    blur = "100px",
    opacity = 0.5
}) => {
    return (
        <div 
            className="absolute -z-50 rounded-full"
            style={{ 
                top,
                right,
                bottom,
                left,
                width: size,
                height: size,
                background: `radial-gradient(
                    circle, 
                    rgba(185, 28, 28, 0.8) 0%, 
                    rgba(153, 27, 27, 0.6) 50%, 
                    rgba(127, 29, 29, 0) 100%
                )`,
                filter: `blur(${blur})`,
                opacity: opacity,
                transform: 'translateZ(0)',
                willChange: 'filter, opacity',
                pointerEvents: 'none',
                transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)'
            }}
            aria-hidden="true"
        />
    )
}

export default BlurCircle