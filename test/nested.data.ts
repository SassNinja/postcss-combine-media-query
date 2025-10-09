
export default `
    .foo {
        color: red;
    }
    @media (min-width: 1024px) {
        .foo {
            color: green;
        }
        @media (min-width: 1200px) {
            .foo {
                color: blue;
            }
        }
    }
`;