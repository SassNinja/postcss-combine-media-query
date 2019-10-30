
module.exports = `
    .foo {
        color: red;
    }
    @media (min-width: 1024px) {
        .foo {
            color: green;
        }
    }
    @media (min-width: 1200px) {
        .foo {
            color: blue;
        }
    }
    .bar {
        font-size: 1rem;
        @supports (display: grid) {
            display: block;
        }
    }
    @media (min-width: 1024px) {
        .bar {
            font-size: 2rem;
            @supports (display: grid) {
                display: grid;
            }
        }
    }
    @media screen and (min-width: 1024px) {
        .bar {
            content: 'similar but different query'
        }
    }
`;