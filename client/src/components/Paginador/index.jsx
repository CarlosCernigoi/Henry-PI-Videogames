import React from 'react';

export default function Paginador({vgXPage, allVg, paginado}) {
    const numbers = []

    for (let i = 0; i < Math.ceil(allVg / vgXPage); i++) {
        numbers.push(i+1)
    }
        return (
            <nav>
                {/* <ul className='paginado'> */}
                    {numbers && numbers.map(number => (
                        // <li className='number' key={number}>
                            <button onClick={() => paginado(number)} key={number}>{number}</button>
                        // </li>
                    ))}
                {/* </ul> */}
            </nav>
        )
}