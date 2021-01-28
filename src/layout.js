import React from 'react';

export default ({ children, location }) => {

    let header = null;

    return (
           

            <div>
                {header}
                < div
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
                <footer
                    style={{
                        textAlign: 'center',
                        padding: `0 20px 80px 0`,
                    }}
                >

                </footer>
            </div >
    )
}
