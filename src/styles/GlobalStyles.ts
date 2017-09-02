export const CardStyle = {
    display: "block",
    boxShadow: "0 2px 2px 0 rgba(0,0,0,0.14), 0 3px 1px -2px rgba(0,0,0,0.12), 0 1px 5px 0 rgba(0,0,0,0.2)",
    backgroundColor: "white"
};

export const BigText = {
    fontSize: "2em"
};

export const GlobalFont = {
    fontFamily: "'Open Sans', sans-serif",
    fontSize: "0.8em"

};

export const TitleFont = {
    fontFamily: "'Reenie Beanie', cursive"
};

export const ButtonFont = {
    fontFamily: "'Cabin Sketch', cursive"
};

export const ModalStyle = {
    overlay: {
        position: 'fixed',
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        backgroundColor: 'rgba(255, 255, 255, 0.75)',
        display: "flex",
        justifyContent: "center",
        alignItems: "center",

    },
    content: {
        position: "relative",
        border: '1px solid #ccc',
        background: '#fff',
        overflow: 'auto',
        WebkitOverflowScrolling: 'touch',
        borderRadius: '0px',
        outline: 'none',
        padding: '20px',
        width: "400px",
        height: "200px",
    }
};