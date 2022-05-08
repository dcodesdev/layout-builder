import { useEffect, useState } from 'react'
import { Stage, Layer } from 'react-konva'
import { SketchPicker } from 'react-color'
import randomColor from 'randomcolor'
import { Input, Modal, Button as ButtonM, Container } from '@mantine/core'
import { useLocalStorage } from '@mantine/hooks'
import { Trash } from 'tabler-icons-react'
import { v4 as uuidv4 } from 'uuid'
import { Login, Button, Rectangle } from './components'
import { Layout, Rectangular, User } from '@types'

const App = () => {
  const [rects, setRects] = useState<Rectangular[]>([])

  const [savedLayouts, setSavedLayouts] = useLocalStorage<Layout[]>({
    key: 'layouts',
    defaultValue: [],
  })

  const [user, setUser] = useLocalStorage<User>({
    key: 'user',
    defaultValue: null,
  })

  const [showSaveModal, setShowSaveModal] = useState(false)

  const [layoutName, setLayoutName] = useState('')

  const [selected, setSelected] = useState<number | null>(null)

  const saveHandler = (e) => {
    e.preventDefault()
    if (layoutName.trim().length === 0) return

    const newLayouts: Layout[] = [
      ...savedLayouts,
      { id: uuidv4(), user_id: user.id, name: layoutName, rects },
    ]
    setSavedLayouts(newLayouts)

    setLayoutName('')
    setShowSaveModal(false)
  }

  const getRandomRectangular = (): Rectangular => ({
    id: uuidv4(),
    // random number between 0 and window.innerWidth,
    x: (Math.random() * window.innerWidth) / 2,
    // random number between 0 and window.innerHeight,
    y: (Math.random() * window.innerHeight) / 2,
    // random number between 100 and 200,
    width: Math.random() * 100 + 100,
    height: Math.random() * 100 + 100,
    color: randomColor(),
  })

  const addRect = () => {
    setRects([...rects, getRandomRectangular()])
  }

  useEffect(() => {
    // add 10 random rectangulars
    const items = Array(10).fill(null).map(getRandomRectangular)
    setRects(items)
  }, [])

  const removeRect = () => {
    setRects(rects.filter((_, index) => index !== selected))
    setSelected(null)
  }

  return user ? (
    <>
      <div className="h-screen p-2 hidden md:block">
        <div className="flex gap-5">
          <div className="flex flex-col justify-between gap-2 w-3/12 min-h-screen">
            <div className="flex flex-col gap-2">
              <Button title="Add" onClick={addRect} />
              <Button
                disabled={selected === null}
                title="Remove"
                onClick={removeRect}
                className={selected === null ? 'opacity-50' : ''}
              />
              <Button
                title="Save Layout"
                onClick={() => setShowSaveModal(true)}
              />
              <Button
                className="text-red-500 hover:bg-red-500 hover:text-white"
                title="Clear"
                onClick={() => {
                  if (window.confirm('Sure?')) {
                    setRects([])
                  }
                }}
              />
              <hr />
              <h2 className="text-lg font-bold text-center">Saved Layouts</h2>
              {savedLayouts.length ? (
                savedLayouts
                  .filter((l) => l.user_id === user.id)
                  .map((layout, index) => (
                    <div
                      key={layout.id}
                      onClick={() => {
                        setRects(layout.rects)
                      }}
                      className="border flex justify-between items-center p-2 rounded-sm hover:bg-gray-100 cursor-pointer"
                    >
                      <p>{layout.name}</p>
                      <Trash
                        onClick={() => {
                          const newLayouts = savedLayouts.filter(
                            (_) => _.id !== layout.id,
                          )
                          setSavedLayouts(newLayouts)
                        }}
                        color="red"
                        size={16}
                      />
                    </div>
                  ))
              ) : (
                <div className="text-gray-500 text-center">
                  You have no saved layouts
                </div>
              )}
              {selected !== null && (
                <SketchPicker
                  color={rects[selected]?.color}
                  onChange={(e) => {
                    setRects((p) => {
                      const newRects = [...p]
                      newRects[selected].color = e.hex
                      return newRects
                    })
                  }}
                  className="w-full"
                />
              )}
            </div>

            <div className="flex p-5 py-2 justify-between cursor-pointer rounded-lg items-center mb-5 border hover:bg-slate-100">
              <div className="flex gap-2 items-center">
                <img
                  className="h-10"
                  src={`https://avatars.dicebear.com/api/adventurer/${user.name}.svg`}
                  alt={user.name}
                />
                <p>{user.name}</p>
              </div>

              <p onClick={() => setUser(null)} className="cursor-pointer">
                Log Out
              </p>
            </div>
          </div>

          <div className="w-9/12 border overflow-hidden">
            <Stage width={window.innerWidth} height={window.innerHeight}>
              <Layer>
                {rects.map((rect, index) => (
                  <Rectangle
                    isSelected={index === selected}
                    onChange={(e) => {
                      setRects((p) => {
                        const newRects = [...p]
                        newRects[index] = e
                        return newRects
                      })
                    }}
                    unselectHandler={() => {
                      setSelected(null)
                      console.log('unselect')
                    }}
                    onSelect={() => setSelected(index)}
                    shapeProps={rect}
                    color={rect.color}
                    key={index}
                  />
                ))}
              </Layer>
              <Layer
                onClick={() => {
                  setSelected(null)
                }}
              />
            </Stage>
          </div>
        </div>
        <Modal
          opened={showSaveModal}
          onClose={() => {
            setShowSaveModal(false)
          }}
          centered
          title="Save Layout"
        >
          <form onSubmit={saveHandler}>
            <Input
              onChange={(e) => {
                setLayoutName(e.target.value)
              }}
              value={layoutName}
              placeholder="Name your layout"
            />
            <ButtonM
              onClick={saveHandler}
              type="submit"
              className="mt-1"
              variant="outline"
            >
              Save
            </ButtonM>
          </form>
        </Modal>
      </div>
      <Container className="py-10 md:hidden">
        <div className="mt-40 text-2xl font-bold text-center">
          This app is not designed for mobile devices currently.
        </div>
      </Container>
    </>
  ) : (
    <Login />
  )
}

export default App
