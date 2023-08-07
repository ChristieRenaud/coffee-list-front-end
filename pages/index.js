import { useEffect, useState } from "react"

export default function Home({ initialData }) {
  const [data, setData] = useState(initialData)
  const [currentPage, setCurrentPage] = useState(1)
  const limit = 10

  useEffect(() => {
    setData(initialData)
  }, [initialData])

  async function fetchData(page) {
    try {
      const response = await fetch(
        `http://localhost:3000/coffee-list?page=${page}&limit=${limit}`
      )
      const newData = await response.json()
      console.log("THe data from the EP:", newData)
      return newData
    } catch (error) {
      console.error("Error fetching data:", error)
    }
  }

  async function handlePrevClick() {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1)
    }
  }

  async function handleNextClick() {
    setCurrentPage(currentPage + 1)
  }

  useEffect(() => {
    async function updateData() {
      const newData = await fetchData(currentPage)
      setData(newData)
    }

    updateData()
  }, [currentPage])

  return (
    <div>
      <h1>Firestore Data Viewer</h1>
      <div>
        {data.map((item, index) => (
          <div key={index} className="data-item">
            <h3>{item.coffee_shop_name}</h3>
            <p>
              <strong>Rating:</strong> {item.rating.trim()}
            </p>
            <p>
              <strong>Category Rating:</strong> {item.cat_rating}
            </p>
            <p>
              <strong>Number of Ratings:</strong> {item.num_ratings}
            </p>
            <p>
              <strong>Review:</strong> {item.review_text.trim()}
            </p>
          </div>
        ))}
      </div>
      <div className="pagination">
        <button onClick={handlePrevClick} disabled={currentPage === 1}>
          Previous Page
        </button>
        <button onClick={handleNextClick} disabled={data.length < limit}>
          Next Page
        </button>
      </div>
      <style jsx>{`
        .data-item {
          border: 2px solid #ccc;
          padding: 10px;
        }

        .pagination {
          margin-top: 10px;
        }
      `}</style>
    </div>
  )
}

export async function getServerSideProps() {
  const initialData = await fetchData(1)
  return {
    props: { initialData },
  }
}

async function fetchData(page) {
  try {
    const response = await fetch(
      `http://localhost:3000/coffee-list?page=1&limit=10`
    )
    // (`/api/collection/your-collection-here`)
    const data = await response.json()
    console.log("The data from the EP:", data)
    return data
  } catch (error) {
    console.error("Error fetching data:", error)
    return []
  }
}
