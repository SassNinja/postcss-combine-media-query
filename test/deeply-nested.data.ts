
export default `
    .foo {
        color: red;
    }
    @media (min-width: 800px) {
        @media (orientation: landscape) {
            @media (min-width: 1200px) {
                .foo {
                    color: purple;
                }
            }
        }
    }
`;


