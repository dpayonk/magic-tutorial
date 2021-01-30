import React from 'react';

export default ({ children, location, backgroundImage }) => {
    let defaultBackgroundImage = 'https://imgix.cosmicjs.com/d8ce4010-39c8-11eb-9ccb-e16da6a16ff7-EFFECTS.jpg?w=2000'

    let footer = (
        <footer
            style={{
                textAlign: 'center',
                padding: `0 20px 80px 0`,
            }}
        >

        </footer>
    )
    let header = (
        <nav style={{ padding: "3px 14px", position: "absolute", width: "100%", zIndex: "100" }}>
            <a style={{ color: 'white',}} href="/">
            My Magic Tutorial
            </a>
        </nav>
    );

    if (backgroundImage === undefined) {
        backgroundImage = defaultBackgroundImage
    }

    return (
        <div>
            {header}
            <section className="hero">
                <div className="hero-body"
                    style={{
                        width: "100%", height: "24.5rem",
                        backgroundImage: `url('${backgroundImage}')`,
                        backgroundSize: "cover",
                        backgroundPosition: "right",

                        position: "relative",
                        marginBottom: "2.625rem"
                    }}>
                </div>
            </section>
            <div
                style={{
                    minWidth: '75vw',
                    maxWidth: '75vw',
                    marginLeft: 'auto',
                    marginRight: 'auto',
                    minHeight: 'calc(100vh - 42px)',
                }}
            >
                {children}
            </div >
            {footer}
        </div >
    )
}
