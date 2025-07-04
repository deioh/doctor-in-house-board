import React, { useEffect } from 'react';
import DisplayBoard from './DisplayBoard';

const TvView = ({ doctors }) => {
    useEffect(() => {
        const enterFullscreen = () => {
            if (document.documentElement.requestFullscreen) {
                document.documentElement.requestFullscreen().catch(err => {
                    console.error(`Error attempting to enable full-screen mode: ${err.message} (${err.name})`);
                });
            }
        };

        // Enter fullscreen when the component mounts
        enterFullscreen();

        const handleFullscreenChange = () => {
            if (!document.fullscreenElement) {
                // If the user exits fullscreen, navigate back to the main page
                window.close(); // Close the tab if possible, or redirect
                // As a fallback for browsers that block window.close:
                // window.location.href = '/';
            }
        };

        document.addEventListener('fullscreenchange', handleFullscreenChange);

        return () => {
            document.removeEventListener('fullscreenchange', handleFullscreenChange);
            if (document.fullscreenElement) {
                document.exitFullscreen();
            }
        };
    }, []);

    return (
        <div className="app-container tv-mode">
            <DisplayBoard doctors={doctors} />
            <div className="tv-mode-exit-message">Press 'Esc' to exit TV Mode</div>
        </div>
    );
};

export default TvView;
