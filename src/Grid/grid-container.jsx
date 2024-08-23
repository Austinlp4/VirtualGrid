export const GridContainer = ({ children }) => {
    return (
        <div className="grid" style={{ width: '100%' }}>
            {children}
        </div>
    );
};