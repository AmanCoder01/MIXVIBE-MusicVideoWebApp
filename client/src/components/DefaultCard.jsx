import React from 'react'

const DefaultCard = ({ category }) => {
    return (
        <div style={{ backgroundColor: `${category?.color}` }} className={`w-[150px] relative  h-[150px] md:w-[200px]  md:h-[200px] rounded-lg p-[1rem]`}>
            <h1 className='text-[1.4rem] text-[#F2F3F4] font-semibold '>{category.name}</h1>
            <img src={category.img} className='h-[90px] w-[80px] object-fill absolute bottom-[-1.1rem] right-3' style={{
                clipPath: "polygon(0 0, 100% 0, 100% 66%, 0 98%)",
                transform: "rotate(20deg)"
            }} alt="" />
        </div>
    )
}

export default DefaultCard
